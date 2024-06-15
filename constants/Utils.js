import FireClass from "codeby5/Support/FirebaseClass";
import { firebaseConfig } from "../firebaseConfig";

const { default: UtilClass } = require("codeby5/Support/UtilsClass");

export const { auth, data } = new FireClass(firebaseConfig)
export const { createArray, formatNumber, getRandNum, filterObject } = new UtilClass
export const { checkCurrentUser, loginWith } = auth
