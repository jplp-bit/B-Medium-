import { IUser, IPost, IComment } from '../types';

export const INITIAL_USERS: IUser[] = [
  {
    _id: 'user-1',
    name: 'Alex Morgan',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    role: 'admin',
    bio: 'Senior Software Architect & Tech Writer. Passionate about distributed systems, clean architecture, and modern web development.',
    createdAt: '2025-01-15T08:00:00.000Z',
  },
  {
    _id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    role: 'user',
    bio: 'UI/UX Specialist & Frontend Developer crafting seamless digital experiences and accessible interfaces.',
    createdAt: '2025-02-01T10:30:00.000Z',
  },
  {
    _id: 'user-3',
    name: 'Marcus Vance',
    email: 'marcus@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    role: 'user',
    bio: 'AI Researcher exploring large language models, agentic workflows, and ethical artificial intelligence.',
    createdAt: '2025-02-10T14:15:00.000Z',
  }
];

export const INITIAL_CATEGORIES = [
  'Engineering',
  'Design & UI',
  'Artificial Intelligence',
  'Productivity',
  'Web Development'
];

export const INITIAL_POSTS: IPost[] = [
  {
    _id: 'post-1',
    title: 'Architecting Scalable React 19 Applications in 2026',
    slug: 'architecting-scalable-react-19-applications-2026',
    content: `Building modern React applications requires a clear separation of concerns, robust state management, and strict modular design principles. In React 19, server components and optimized state handlers redefine how we build web apps.

## Key Architecture Principles

1. **Modular Directory Layout**: Organize features by domain rather than global component dumping grounds.
2. **Unidirectional Data Flow**: Keep state as localized as possible and hoist only when multiple branches require real-time synchronization.
3. **Type Safety with TypeScript**: Enforce explicit contracts across API payloads and UI props.

### Code Example: Clean Custom Hook Pattern

\`\`\`typescript
import { useState, useEffect } from 'react';

export function useFetchData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch(url)
      .then(res => res.json())
      .then(result => {
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [url]);

  return { data, loading };
}
\`\`\`

## Conclusion
Adhering to strict architectural standards ensures your codebase remains maintainable, performant, and delightful to develop on.`,
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&auto=format&fit=crop&q=80',
    author: INITIAL_USERS[0],
    category: 'Engineering',
    tags: ['React', 'TypeScript', 'Frontend', 'Architecture'],
    likes: ['user-2', 'user-3'],
    views: 1420,
    readingTime: 4,
    createdAt: '2026-06-12T09:00:00.000Z'
  },
  {
    _id: 'post-2',
    title: 'The Art of Minimalist UI Design: Less is More',
    slug: 'art-of-minimalist-ui-design-less-is-more',
    content: `Minimalism in user interface design is not merely about removing elements—it is about highlighting what truly matters through intentional spatial discipline and refined typography.

## Core Rules of Minimalist UI

* **Generous Negative Space**: Allow elements room to breathe.
* **Controlled Color Palettes**: Limit primary colors and reserve high-contrast accents for focal actions.
* **Typographic Hierarchy**: Use clear optical weight variations rather than excessive visual decorations.

> "Simplicity is about subtracting the obvious and adding the meaningful." — John Maeda

## Design System Considerations

When designing a clean dashboard or publishing platform, maintain a consistent spacing rhythm (4px/8px grid) and optical balance across all viewports.`,
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    author: INITIAL_USERS[1],
    category: 'Design & UI',
    tags: ['UI/UX', 'Design System', 'Tailwind', 'Minimalism'],
    likes: ['user-1'],
    views: 980,
    readingTime: 3,
    createdAt: '2026-06-20T11:30:00.000Z'
  },
  {
    _id: 'post-3',
    title: 'Understanding Agentic Workflows and Context Pipelines',
    slug: 'understanding-agentic-workflows-and-context-pipelines',
    content: `As artificial intelligence models evolve, the focus shifts from static single-turn completion prompts to continuous agentic execution frameworks.

## What Makes an Agentic System?

* **Reasoning and Decomposition**: Breaking complex high-level directives into discrete sub-tasks.
* **Tool Invocation**: Dynamically calling APIs, database drivers, or search interfaces.
* **Self-Correction & Reflection**: Evaluating execution outputs and adjusting strategies in real-time.

\`\`\`json
{
  "agent": "CodeArchitect",
  "status": "executing",
  "stepsCompleted": 3,
  "confidenceScore": 0.98
}
\`\`\`

Agentic workflows open incredible opportunities for automated developer tooling and interactive intelligent systems.`,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80',
    author: INITIAL_USERS[2],
    category: 'Artificial Intelligence',
    tags: ['AI', 'Machine Learning', 'Agents', 'Future Tech'],
    likes: ['user-1', 'user-2'],
    views: 2150,
    readingTime: 5,
    createdAt: '2026-07-01T15:45:00.000Z'
  }
];

export const INITIAL_COMMENTS: IComment[] = [
  {
    _id: 'comment-1',
    post: 'post-1',
    user: INITIAL_USERS[1],
    comment: 'Great article! The custom hook pattern with unmount safety is crucial for avoiding memory leaks in React 19.',
    parentComment: null,
    createdAt: '2026-06-13T10:15:00.000Z'
  },
  {
    _id: 'comment-2',
    post: 'post-1',
    user: INITIAL_USERS[0],
    comment: 'Thanks Sarah! Excited to see how server actions further streamline this.',
    parentComment: 'comment-1',
    createdAt: '2026-06-13T11:00:00.000Z'
  },
  {
    _id: 'comment-3',
    post: 'post-2',
    user: INITIAL_USERS[2],
    comment: 'The focus on negative space really hits home. Often developers try to fill every pixel with widgets.',
    parentComment: null,
    createdAt: '2026-06-21T08:20:00.000Z'
  }
];
