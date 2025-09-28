import { CreatePost } from "./c-create-post"
import { ProtectedRoute } from "@/components/protected-route"

export default function CreatePostPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-2xl">
          <CreatePost />
        </div>
      </div>
    </ProtectedRoute>
  )
}
