import FireClass from "codeby5/Support/FirebaseClass";
import { firebaseConfig } from "../firebaseConfig";
import StripeClass from 'codeby5/Support/StripeClass'

const { default: UtilClass } = require("codeby5/Support/UtilsClass");

export const { auth, data } = new FireClass(firebaseConfig)
export const { createArray, formatNumber, getRandNum, filterObjects } = new UtilClass
export const { addToDocumentCollection, fetchDocument, updateDocumentCollection, updateDocumentCollectionArrayItem } = data
export const { checkCurrentUser } = auth
