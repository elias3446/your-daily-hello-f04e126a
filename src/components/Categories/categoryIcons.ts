import {
  Tag, Folder, Bug, Lightbulb, Wrench, HelpCircle, MessageSquare,
  AlertTriangle, FileText, Settings, Shield, Users, Zap, Heart,
  Star, BookOpen, Globe, Server, Database, Code,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const CATEGORY_ICONS: { name: string; Icon: LucideIcon }[] = [
  { name: 'Tag', Icon: Tag },
  { name: 'Folder', Icon: Folder },
  { name: 'Bug', Icon: Bug },
  { name: 'Lightbulb', Icon: Lightbulb },
  { name: 'Wrench', Icon: Wrench },
  { name: 'HelpCircle', Icon: HelpCircle },
  { name: 'MessageSquare', Icon: MessageSquare },
  { name: 'AlertTriangle', Icon: AlertTriangle },
  { name: 'FileText', Icon: FileText },
  { name: 'Settings', Icon: Settings },
  { name: 'Shield', Icon: Shield },
  { name: 'Users', Icon: Users },
  { name: 'Zap', Icon: Zap },
  { name: 'Heart', Icon: Heart },
  { name: 'Star', Icon: Star },
  { name: 'BookOpen', Icon: BookOpen },
  { name: 'Globe', Icon: Globe },
  { name: 'Server', Icon: Server },
  { name: 'Database', Icon: Database },
  { name: 'Code', Icon: Code },
];

export function getIconByName(name: string): LucideIcon {
  return CATEGORY_ICONS.find(i => i.name === name)?.Icon || Tag;
}
