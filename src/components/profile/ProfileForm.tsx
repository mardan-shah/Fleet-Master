import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"
import type React from "react"
import { UserData } from "@/types/user"

interface ProfileFormProps {
  isEditing: boolean
  userData: UserData
  setTempUserData: React.Dispatch<React.SetStateAction<UserData>>
  handleSaveChanges: () => void
  handleCancelEdit: () => void
}

export default function ProfileForm({
  isEditing,
  userData,
  setTempUserData,
  handleSaveChanges,
  handleCancelEdit,
}: ProfileFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 text-primaryaccent">
      <Separator className="bg-primaryaccent" />
      <div className="space-y-4">
        {[
          { id: "name", label: "Full Name", type: "text" },
          { id: "email", label: "Email", type: "email" },
          { id: "phone", label: "Phone", type: "tel" },
          { id: "company", label: "Company", type: "text" },
          { id: "department", label: "Department", type: "text" },
          { id: "employeeId", label: "Employee ID", type: "text" },
          { id: "location", label: "Location", type: "text" },
          { id: "role", label: "Role", type: "text" },
        ].map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              name={field.id}
              type={field.type}
              value={(userData as any)[field.id] || ""}
              onChange={handleInputChange}
              className="bg-input border-input text-foreground"
              disabled={!isEditing}
            />
          </div>
        ))}
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={userData.bio || ""}
            onChange={handleInputChange}
            className="bg-input border-input text-foreground"
            rows={4}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="flex justify-between">
        {isEditing && (
          <>
            <Button onClick={handleSaveChanges} className="bg-primaryaccent text-primary-foreground hover:bg-primary/90">
              Save Changes
            </Button>
            <Button
              onClick={handleCancelEdit}
              variant="outline"
              className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
