import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useProfiles } from "@/hooks/useProfiles";
import {
  useCreateFeedback,
  useFeedbacks,
  useToggleFeedbackReaction,
} from "@/hooks/useFeedbacks";

type Filter = "all" | "for_me" | "by_me";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "for_me", label: "Para mim" },
  { key: "by_me", label: "Enviados por mim" },
];

export default function FeedbacksPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { data: profiles = [] } = useProfiles();
  const { data: feedbacks = [], isLoading } = useFeedbacks(user?.id);
  const createFeedback = useCreateFeedback();
  const toggleReaction = useToggleFeedbackReaction();

  const filteredFeedbacks = useMemo(() => {
    if (!user?.id) return feedbacks;

    if (activeFilter === "for_me") {
      return feedbacks.filter((fb) => fb.toUserId === user.id);
    }

    if (activeFilter === "by_me") {
      return feedbacks.filter((fb) => fb.fromUserId === user.id);
    }

    return feedbacks;
  }, [activeFilter, feedbacks, user?.id]);

  const resetForm = () => {
    setRecipientId("");
    setMessage("");
    setIsAnonymous(false);
  };

  const handleSubmit = async () => {
    if (!user?.id || !recipientId || !message.trim()) return;

    try {
      await createFeedback.mutateAsync({
        fromUserId: user.id,
        toUserId: recipientId,
        message,
        isAnonymous,
      });
      toast.success("Elogio enviado com sucesso!");
      setModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Não foi possível enviar o elogio.");
    }
  };

  const handleReaction = async (feedbackId: string, emoji: string, reactedByMe: boolean) => {
    if (!user?.id) return;

    try {
      await toggleReaction.mutateAsync({
        feedbackId,
        userId: user.id,
        emoji,
        reactedByMe,
      });
    } catch (error) {
      toast.error("Não foi possível atualizar a reação.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">💬 Feedbacks</h1>
        <p className="text-muted-foreground text-sm mt-1">Reconheça o trabalho dos seus colegas</p>
      </div>

      {/* Gradient separator */}
      <div className="gradient-separator rounded-full" />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === f.key
                ? "gradient-brand text-white shadow-md"
                : "bg-card text-muted-foreground border border-border hover:border-foreground/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
            Carregando feedbacks...
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
            Nenhum feedback encontrado ainda.
          </div>
        ) : (
          filteredFeedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow animate-fade-in"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm">
                  {fb.isAnonymous ? "?" : fb.fromName.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-foreground">
                  {fb.isAnonymous ? "Anônimo" : fb.fromName}
                </span>
                <ArrowRight size={16} className="text-muted-foreground" />
                <span className="font-bold gradient-text">{fb.toName}</span>
              </div>

              {/* Message */}
              <p className="text-foreground/90 leading-relaxed mb-3">{fb.message}</p>

              {/* Footer */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex gap-2 flex-wrap">
                  {fb.reactions.map((r) => (
                    <button
                      key={r.emoji}
                      onClick={() => handleReaction(fb.id, r.emoji, r.reactedByMe)}
                      disabled={toggleReaction.isPending}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all ${
                        r.reactedByMe
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-muted border border-transparent hover:border-border"
                      }`}
                    >
                      <span>{r.emoji}</span>
                      <span className="text-muted-foreground font-medium">{r.count}</span>
                    </button>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{fb.createdAt}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) resetForm(); }}>
        <DialogTrigger asChild>
          <button className="fixed bottom-6 right-6 gradient-brand text-white rounded-full px-6 py-4 shadow-2xl hover:shadow-3xl hover:brightness-110 transition-all flex items-center gap-2 font-semibold text-sm z-50">
            <Plus size={20} />
            Dar Elogio
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="gradient-text text-xl">Dar um Elogio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Destinatário</Label>
              <Select value={recipientId} onValueChange={setRecipientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o colaborador" />
                </SelectTrigger>
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
              <Label>Mensagem</Label>
              <Textarea
                placeholder="Escreva seu elogio..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="anonymous" className="text-sm">Enviar como anônimo</Label>
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>
            <Button
              variant="gradient"
              className="w-full h-11 rounded-xl font-semibold"
              onClick={handleSubmit}
              disabled={!recipientId || !message.trim() || createFeedback.isPending}
            >
              {createFeedback.isPending ? "Enviando..." : "Enviar Elogio"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
