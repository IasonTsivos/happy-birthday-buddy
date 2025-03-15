
export interface Birthday {
  id: string;
  name: string;
  date: string; // ISO string
  avatarId: string;
  message?: string;
  giftIdeas?: string;
}

export type AvatarOption = {
  id: string;
  label: string;
  emoji: string;
};

export const avatarOptions: AvatarOption[] = [
  { id: 'cat', label: 'Cat', emoji: '🐱' },
  { id: 'dog', label: 'Dog', emoji: '🐶' },
  { id: 'rabbit', label: 'Rabbit', emoji: '🐰' },
  { id: 'fox', label: 'Fox', emoji: '🦊' },
  { id: 'bear', label: 'Bear', emoji: '🐻' },
  { id: 'panda', label: 'Panda', emoji: '🐼' },
  { id: 'tiger', label: 'Tiger', emoji: '🐯' },
  { id: 'lion', label: 'Lion', emoji: '🦁' },
  { id: 'cow', label: 'Cow', emoji: '🐮' },
  { id: 'pig', label: 'Pig', emoji: '🐷' },
  { id: 'monkey', label: 'Monkey', emoji: '🐵' },
  { id: 'frog', label: 'Frog', emoji: '🐸' },
];

export function getAvatarById(id: string): AvatarOption {
  return avatarOptions.find(avatar => avatar.id === id) || avatarOptions[0];
}
