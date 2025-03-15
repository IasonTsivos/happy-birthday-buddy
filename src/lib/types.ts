
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
  src: string;
};

export const avatarOptions: AvatarOption[] = [
  { id: 'cat', label: 'Cat', src: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'kitten', label: 'Kitten', src: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'deer', label: 'Deer', src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'antelope', label: 'Antelope', src: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'horses', label: 'Horses', src: 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'comodo', label: 'Comodo Dragon', src: 'https://images.unsplash.com/photo-1487252665478-49b61b47f302?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'penguins', label: 'Penguins', src: 'https://images.unsplash.com/photo-1441057206919-63d19fac2369?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'monkey', label: 'Monkey', src: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?auto=format&fit=crop&w=150&h=150&q=80' },
];

export function getAvatarById(id: string): AvatarOption {
  return avatarOptions.find(avatar => avatar.id === id) || avatarOptions[0];
}
