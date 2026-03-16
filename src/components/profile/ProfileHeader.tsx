"use client"

import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Camera, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import imageCompression from "browser-image-compression"
import { UserData } from "@/types/user"

interface ProfileHeaderProps {
  userData: UserData
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  setTempUserData: React.Dispatch<React.SetStateAction<UserData>>
  handleSaveChanges: () => void
}

export default function ProfileHeader({
  userData,
  isEditing,
  setIsEditing,
  setTempUserData,
  handleSaveChanges,
}: ProfileHeaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 400,
        useWebWorker: true,
      }
      const compressedFile = await imageCompression(file, options)

      const formData = new FormData()
      formData.append("file", compressedFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const { url } = await response.json()
      setTempUserData((prev) => ({ ...prev, avatar: url }))
      
      toast({
        title: "Avatar Uploaded",
        description: "Your profile picture has been updated. Don't forget to save changes.",
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload avatar.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-dark-border">
      <div className="relative group">
        <Avatar className="w-24 h-24 border-2 border-primaryaccent">
          <AvatarImage src={userData.avatar || "/placeholder-user.jpg"} alt={userData.name} />
          <AvatarFallback className="bg-dark-hover text-primaryaccent text-2xl">
            {userData.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <Label
            htmlFor="avatar-upload"
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
          >
            <Camera className="w-8 h-8 text-white" />
            <Input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={isUploading} />
          </Label>
        )}
      </div>
      <div className="flex-1 text-center sm:text-left space-y-1">
        <h1 className="text-2xl font-bold text-primaryaccent">{userData.name}</h1>
        <p className="text-gray-muted">{userData.role}</p>
        <p className="text-sm text-gray-muted">{userData.company}</p>
      </div>
      <div className="flex space-x-2">
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="border-primaryaccent text-primaryaccent hover:bg-primaryaccent hover:text-dark"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <Button onClick={handleSaveChanges} className="bg-primaryaccent text-dark hover:bg-primaryaccent/90">
            Save Changes
          </Button>
        )}
      </div>
    </div>
  )
}
