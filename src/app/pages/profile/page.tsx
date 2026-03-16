"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import DeleteAccountButton from "@/components/profile/DeleteAccountButton";
import { getUserData, updateUserData } from "@/app/actions/user";
import { UserData } from "@/types/user";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    bio: "",
    avatar: "",
    company: "",
    location: "",
    department: "",
    employeeId: "",
  });
  const [tempUserData, setTempUserData] = useState<UserData>(userData);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      const data = await getUserData();
      if (!data) return;

      const sanitizedData: UserData = {
        id: data.id,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "",
        bio: data.bio || "",
        avatar: data.avatar || "",
        company: data.company || "",
        location: data.location || "",
        department: data.department || "",
        employeeId: data.employee_id || "",
      };

      setUserData(sanitizedData);
      setTempUserData(sanitizedData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data.",
        variant: "destructive",
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updateData = {
        name: tempUserData.name,
        email: tempUserData.email,
        phone: tempUserData.phone,
        role: tempUserData.role,
        bio: tempUserData.bio,
        company: tempUserData.company,
        location: tempUserData.location,
        department: tempUserData.department,
        employee_id: tempUserData.employeeId,
      };

      await updateUserData(updateData);

      setUserData(tempUserData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 bg-dark text-foreground min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <ProfileHeader
          userData={userData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setTempUserData={setTempUserData}
          handleSaveChanges={handleSaveChanges}
        />
        <ProfileForm
          isEditing={isEditing}
          userData={isEditing ? tempUserData : userData}
          setTempUserData={setTempUserData}
          handleSaveChanges={handleSaveChanges}
          handleCancelEdit={() => {
            setTempUserData(userData);
            setIsEditing(false);
          }}
        />
        <DeleteAccountButton />
      </div>
    </div>
  );
}
