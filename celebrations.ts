import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useProfiles } from "@/hooks/useProfiles";
import {
  useCelebrations,
  useCreateCelebration,
  useToggleCelebrationReaction,
} from "@/hooks/useCelebrations";
import type { CelebrationType } from "@/lib/types";

const celebrationTypes: {
  type: CelebrationType;
  emoji: string;
  label: string;
  borderColor: string;
  bgColor: string;
}[] = [
  { type: "birthday", emoji: "🎂", label: "Aniversário", borderColor: "border-yellow-400", bgColor: "bg-yellow-50" },
  { type: "admission", emoji: "🎉", label: "Data de Admissão", borderColor: "border-elogie-green", bgColor: "bg-green-50" },
  { type: "achievement", emoji: "🏆", label: "Conquista", borderColor: "border-yellow-500", bgColor: "bg-amber-50" },
  { type: "baby", emoji: "👶", label: "Bebê", borderColor: "border-pink-400", bgColor: "bg-pink-50" },
  { type: "wedding", emoji: "💍", label: "Casamento", borderColor: "border-purple-400", bgColor: "bg-purple-50" },
  { type: "custom", emoji: "⭐", label: "Personalizado", borderColor: "border-elogie-teal", bgColor: "bg-teal-50" },
];

export default function CelebrationsPage() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [selType, setSelType] = useState<CelebrationType | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [celebrationDate, setCelebrationDate] = useState("");

  const { data: profiles = [] } = useProfiles();
  const { data: celebrations = [], isLoading } = useCelebrations(user?.id);
  const createCelebration = useCreateCelebration();
  const toggleReaction = useToggleCelebrationReaction();

  const getTypeConfig = (type: string) =>
    celebrationTypes.find((t) => t.type === type) || celebrationTypes[5];

  const resetForm = () => {
    setUserId("");
    setSelType("");
    setTitle("");
    setDescription("");
    setCelebrationDate("");
  };

  const handleCreate = async () => {
    if (!user?.id || !userId || !selType || !title.trim() || !description.trim() || !celebrationDate) return;

    try {
      await createCelebration.mutateAsync({
        userId,
        createdBy: user.id,
        type: selType,
        title,
        description,
        celebrationDate,
      });
      toast.success("Comemoração criada com sucesso!");
      setModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Não foi possível criar a comemoração.");
    }
  };

  const handleReaction = async (celebrationId: string, reactedByMe: boolean) => {
    if (!user?.id) return;

    try {
      await toggleReaction.mutateAsync({ celebrationId, userId: user.id, reactedByMe });
    } catch (error) {
      toast.error("Não foi possível atualizar a reação.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">🎉 Comemorações</h1>
        <p className="text-muted-foreground text-sm mt-1">Celebre os momentos especiais da equipe</p>
      </div>

      <div className="gradient-separator rounded-full" />

      {/* Grid */}
      {isLoading ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
          Carregando comemorações...
        </div>
      ) : celebrations.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
          Nenhuma comemoração cadastrada ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {celebrations.map((c) => {
            const config = getTypeConfig(c.type);
            const reaction = c.reactions[0];
            return (
              <div
                key={c.id}
                className={`relative rounded-2xl border-2 ${config.borderColor} ${config.bgColor} p-5 shadow-sm hover:shadow-md transition-all animate-fade-in`}
              >
                {c.isToday && (
                  <span className="absolute -top-2 -right-2 bg-card border border-border rounded-full px-3 py-1 text-xs font-bold shadow-md">
                    Hoje 🎉
                  </span>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full gradient-brand flex items-center justify-center text-white font-bold">
                    {c.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{c.userName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>{config.emoji}</span> {config.label}
                    </p>
                  </div>
                </div>
                <h3 className="font-bold text-foreground mb-1">{c.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{c.description}</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(`${c.celebrationDate}T00:00:00`).toLocaleDateString('pt-BR')}
                  </span>
                  <button
                    onClick={() => handleReaction(c.id, reaction?.reactedByMe ?? false)}
                    disabled={toggleReaction.isPending}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all ${
                      reaction?.reactedByMe
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-white/70 border border-transparent hover:border-border"
                    }`}
                  >
                    <span>🎉</span>
                    <span className="text-muted-foreground font-medium">{reaction?.count ?? 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FAB */}
      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) resetForm(); }}>
        <DialogTrigger asChild>
          <button className="fixed bottom-6 right-6 gradient-brand text-white rounded-full px-6 py-4 shadow-2xl hover:brightness-110 transition-all flex items-center gap-2 font-semibold text-sm z-50">
            <Plus size={20} />
            Comemorar
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="gradient-text text-xl">Nova Comemoração</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Colaborador</Label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger><SelectValue placeholder="Selecione o colaborador" /></SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}{profile.department ? ` · ${profile.department}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={selType} onValueChange={(value) => setSelType(value as CelebrationType)}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>
                  {celebrationTypes.map((t) => (
                    <SelectItem key={t.type} value={t.type}>
                      {t.emoji} {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex: Aniversário de 5 anos" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Conte mais sobre..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Data</Label>
              <Input value={celebrationDate} onChange={(event) => setCelebrationDate(event.target.value)} type="date" />
            </div>
            <Button
              variant="gradient"
              className="w-full h-11 rounded-xl font-semibold"
              onClick={handleCreate}
              disabled={!userId || !selType || !title.trim() || !description.trim() || !celebrationDate || createCelebration.isPending}
            >
              {createCelebration.isPending ? "Criando..." : "Criar Comemoração"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
