import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  useCreateGratitudePost,
  useGratitudePosts,
  useToggleGratitudeReaction,
} from "@/hooks/useGratitude";

const postitColors = [
  "bg-postit-yellow",
  "bg-postit-green",
  "bg-postit-pink",
  "bg-postit-blue",
  "bg-postit-peach",
];

export default function GratitudePage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { data: gratitudes = [], isLoading } = useGratitudePosts(user?.id);
  const createGratitude = useCreateGratitudePost();
  const toggleLike = useToggleGratitudeReaction();

  const handlePublish = async () => {
    if (!user?.id || !message.trim()) return;

    const color = postitColors[Math.floor(Math.random() * postitColors.length)];

    try {
      await createGratitude.mutateAsync({
        userId: user.id,
        message,
        isAnonymous,
        color,
      });
      toast.success("Gratidão publicada com sucesso!");
      setMessage("");
      setIsAnonymous(false);
    } catch (error) {
      toast.error("Não foi possível publicar sua gratidão.");
    }
  };

  const handleLike = async (gratitudeId: string, likedByMe: boolean) => {
    if (!user?.id) return;

    try {
      await toggleLike.mutateAsync({ gratitudeId, userId: user.id, likedByMe });
    } catch (error) {
      toast.error("Não foi possível atualizar a reação.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">🙏 Quadro da Gratidão</h1>
        <p className="text-muted-foreground text-sm mt-1">Compartilhe sua gratidão com a equipe</p>
      </div>

      <div className="gradient-separator rounded-full" />

      {/* Publish form */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
        <Textarea
          placeholder="Escreva sua gratidão..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="resize-none mb-4"
        />
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Switch
              id="anon-gratitude"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anon-gratitude" className="text-sm text-muted-foreground">
              {isAnonymous ? "Anônimo" : "Identificado"}
            </Label>
          </div>
          <Button
            variant="gradient"
            className="rounded-xl font-semibold px-6"
            onClick={handlePublish}
            disabled={!message.trim() || createGratitude.isPending}
          >
            {createGratitude.isPending ? "Publicando..." : "Publicar"}
          </Button>
        </div>
      </div>

      {/* Post-it grid */}
      {isLoading ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
          Carregando gratidões...
        </div>
      ) : gratitudes.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
          Nenhuma gratidão publicada ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gratitudes.map((g) => (
            <div
              key={g.id}
              className={`${g.color} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 animate-fade-in`}
            >
              <p className="text-foreground/90 text-sm leading-relaxed mb-4 min-h-[60px]">
                {g.message}
              </p>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-foreground/60">
                  — {g.isAnonymous ? "Anônimo" : g.userName}
                </span>
                <button
                  onClick={() => handleLike(g.id, g.likedByMe)}
                  disabled={toggleLike.isPending}
                  className={`flex items-center gap-1 text-sm transition-all ${
                    g.likedByMe ? "scale-110" : ""
                  }`}
                >
                  <span>❤️</span>
                  <span className="text-foreground/60 text-xs font-medium">
                    {g.likes}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
