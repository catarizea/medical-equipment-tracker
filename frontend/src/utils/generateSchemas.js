import { generateSchemas } from '@medical-equipment-tracker/validator';

import language from './getBrowserLanguage';

const schemas = generateSchemas(language);

export default schemas;