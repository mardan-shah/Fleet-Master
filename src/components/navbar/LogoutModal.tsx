import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

const LogoutModal = ({ isOpen, onClose, onConfirm }: any) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      
      <AlertDialogContent className="bg-[#2a2a2a] border-[#3a3a3a] text-[#c4c4c4]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#ce6d2c]">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be logged out of your account. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-[#333333] text-[#c4c4c4] hover:bg-[#3a3a3a]">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">Log Out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutModal;
