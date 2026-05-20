import { auth } from '@/auth'
import { db } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  const [folders, tags] = await Promise.all([
    db.folder.findMany({
      where: { userId: session!.user.id },
      orderBy: { name: 'asc' },
    }),
    db.tag.findMany({
      where: { userId: session!.user.id },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar folders={folders} tags={tags} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
