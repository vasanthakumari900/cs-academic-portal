import AdminManageContent from "./AdminManageContent";
import { noteService } from "../../services/noteService";
export default function ManageNotes() {
  return <AdminManageContent title="Manage Notes" service={noteService} />;
}
