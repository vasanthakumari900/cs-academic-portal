// src/services/videoService.js
import { createCollectionService } from "./firestoreService";
import { COLLECTIONS } from "../utils/constants";

export const videoService = createCollectionService(COLLECTIONS.VIDEOS);
