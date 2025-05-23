/*
 * Copyright (c) 2023.
 * File Name: index.ts
 * Author: Coderthemes
 */

import { deepMergeObjects } from "../../helpers/global";
import getTableOverWrites from "./table";
import getTooltipOverWrites from "./tooltip";
const componentOverrides = theme => {
  return deepMergeObjects([getTableOverWrites(theme), getTooltipOverWrites(theme)]);
};
export default componentOverrides;