import { auth } from '@/auth'
import { db } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { MobileSidebarOverlay } from '@/components/mobile-sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  const [folders, tags] = await Promise.all([
    db.folder.findMany({ where: { userId: session!.user.id }, orderBy: { name: 'asc' } }),
    db.tag.findMany({ where: { userId: session!.user.id }, orderBy: { name: 'asc' } }),
  ])

  const sidebarContent = <Sidebar folders={folders} tags={tags} />

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        {sidebarContent}
        {/* Mobile drawer */}
        <MobileSidebarOverlay>{sidebarContent}</MobileSidebarOverlay>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
