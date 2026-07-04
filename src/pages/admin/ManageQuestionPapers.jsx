import AdminManageContent from "./AdminManageContent";
import { questionPaperService } from "../../services/questionPaperService";
export default function ManageQuestionPapers() {
  return <AdminManageContent title="Manage Question Papers" service={questionPaperService} />;
}
