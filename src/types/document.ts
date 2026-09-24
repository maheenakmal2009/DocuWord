export type PageSize = 'letter' | 'a4' | 'legal';
export type Orientation = 'portrait' | 'landscape';
export type ViewMode = 'print' | 'web' | 'read';

export interface Margins {
  top: number;     // in inches, e.g. 1.0
  right: number;
  bottom: number;
  left: number;
}

export interface WatermarkConfig {
  enabled: boolean;
  text: string;
  opacity: number;
  color: string;
}

export interface HeaderFooterConfig {
  headerText: string;
  footerText: string;
  showPageNumbers: boolean;
  pageNumberPosition: 'footer-right' | 'footer-center' | 'header-right';
}

export interface DocumentOutlineItem {
  id: string;
  text: string;
  level: number; // 1 = h1, 2 = h2, 3 = h3
}

export interface CommentReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface DocumentComment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  resolved: boolean;
  replies: CommentReply[];
}

export interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeThrough: boolean;
  subscript: boolean;
  superscript: boolean;
  fontName: string;
  fontSize: string;
  foreColor: string;
  hiliteColor: string;
  align: 'left' | 'center' | 'right' | 'justify';
  heading: string;
  list: 'none' | 'ul' | 'ol';
}

export interface DocumentMetadata {
  title: string;
  author: string;
  lastModified: string;
  createdDate: string;
  tags: string[];
}

export interface DocumentTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  badge?: string;
  content: string;
}
