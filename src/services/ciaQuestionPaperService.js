// src/services/ciaQuestionPaperService.js
import { createCollectionService } from "./firestoreService";
import { COLLECTIONS } from "../utils/constants";

export const ciaQuestionPaperService = createCollectionService(COLLECTIONS.CIA_QUESTION_PAPERS);
