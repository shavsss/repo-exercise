import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const APP_DIR = path.resolve(here, "..");
export const DATA_DIR = path.join(APP_DIR, "data");
/** Learner data (conversations, progress). Not committed. */
export const USER_DIR = process.env.STUDY_LAB_DATA ?? path.join(DATA_DIR, "user");
