import AdminManageContent from "./AdminManageContent";
import { videoService } from "../../services/videoService";
export default function ManageVideos() {
  return <AdminManageContent title="Manage Videos" service={videoService} />;
}
