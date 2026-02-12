import {
  Hospital, Microscope, Zap, FlaskConical, RotateCcw, Brain, Flame, Gem, Crown, Star,
  Trophy, Target, ClipboardList, Eye, Feather, Pill, PenTool, BookOpen, Timer,
  MousePointer, BarChart3, PenLine, Smile, Lock, KeyRound, Key, Ticket,
  Laugh, Glasses, Ghost, Squirrel, Cat, Fish, Skull, Bot, Orbit, Sparkles, Bird,
  Palette, Gamepad2, Medal, Tent, Pencil, X, Lightbulb, Check,
  Frown, Angry, Meh, CircleHelp, Waves, Search, Stethoscope, Paperclip,
  ThumbsUp, TrendingUp, TrendingDown, AlertTriangle, Siren, DoorOpen,
  Bone, Droplets, PartyPopper, Drama,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  hospital: Hospital,
  microscope: Microscope,
  zap: Zap,
  "flask-conical": FlaskConical,
  "rotate-ccw": RotateCcw,
  brain: Brain,
  flame: Flame,
  gem: Gem,
  crown: Crown,
  star: Star,
  trophy: Trophy,
  target: Target,
  "clipboard-list": ClipboardList,
  eye: Eye,
  feather: Feather,
  pill: Pill,
  "pen-tool": PenTool,
  "book-open": BookOpen,
  timer: Timer,
  "mouse-pointer": MousePointer,
  "bar-chart-3": BarChart3,
  "pen-line": PenLine,
  smile: Smile,
  lock: Lock,
  "key-round": KeyRound,
  key: Key,
  ticket: Ticket,
  medal: Medal,
  "gamepad-2": Gamepad2,
  ghost: Ghost,
  tent: Tent,
  "party-popper": PartyPopper,
  drama: Drama,
  pencil: Pencil,
  x: X,
  lightbulb: Lightbulb,
  check: Check,
  laugh: Laugh,
  glasses: Glasses,
  frown: Frown,
  angry: Angry,
  meh: Meh,
  "circle-help": CircleHelp,
  waves: Waves,
  search: Search,
  stethoscope: Stethoscope,
  paperclip: Paperclip,
  "thumbs-up": ThumbsUp,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "alert-triangle": AlertTriangle,
  siren: Siren,
  "door-open": DoorOpen,
  palette: Palette,
  sparkles: Sparkles,
  squirrel: Squirrel,
  cat: Cat,
  fish: Fish,
  bird: Bird,
  skull: Skull,
  bone: Bone,
  bot: Bot,
  orbit: Orbit,
  droplets: Droplets,
};

interface GameIconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export default function GameIcon({ name, size = 24, className, strokeWidth }: GameIconProps) {
  const IconComponent = ICON_MAP[name];

  // Fallback: if the name isn't a known icon (e.g. legacy emoji avatar), render as text
  if (!IconComponent) {
    return <span className={className}>{name}</span>;
  }

  return <IconComponent size={size} className={className} strokeWidth={strokeWidth} />;
}

export { ICON_MAP };
