// src/pages/faculty/UploadQuestionPapers.jsx
import UploadForm from "../../components/dashboard/UploadForm";
import { questionPaperService } from "../../services/questionPaperService";
import { STORAGE_PATHS } from "../../utils/constants";

export default function UploadQuestionPapers() {
  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold">Upload Question Paper</h2>
      <UploadForm
        service={questionPaperService}
        storagePath={STORAGE_PATHS.QUESTION_PAPERS}
        fileLabel="PDF File"
        fileAccept="application/pdf"
        extraFields={[
          { name: "year", label: "Year", type: "number", required: true },
          { name: "regulation", label: "Regulation (e.g. R21)", required: true },
        ]}
      />
    </div>
  );
}
