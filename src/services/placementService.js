// src/services/placementService.js
import { createCollectionService } from "./firestoreService";
import { COLLECTIONS } from "../utils/constants";

export const placementService = createCollectionService(COLLECTIONS.PLACEMENTS);
