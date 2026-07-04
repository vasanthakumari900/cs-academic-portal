// src/services/questionPaperService.js
import { createCollectionService } from "./firestoreService";
import { COLLECTIONS } from "../utils/constants";

export const questionPaperService = createCollectionService(COLLECTIONS.QUESTION_PAPERS);
