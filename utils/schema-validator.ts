import fs from 'fs/promises';
import path from "path";
import Ajv from "ajv";
import { createSchema } from "genson-js";
import addFormats from "ajv-formats"

const SCHEMA_BASE_PATH = './response-schemas'
// continue validating the schema even after errors
const ajv = new Ajv({allErrors: true})
addFormats(ajv)

export async function validateSchema(dirName: string, fileName: string, responseBody: object, createSchemaFlag: boolean = false) {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`)

    if(createSchemaFlag) await generateNewSchema(responseBody, schemaPath)

    const schema = await loadSchema(schemaPath)
    
    const validate = ajv.compile(schema)
    const valid = validate(responseBody)
    if(!valid) {
        throw new Error(
            `Schema validation ${fileName}_schema.json failed:\n` +
            `${JSON.stringify(validate.errors, null, 4)}\n\n` +
            `Actual response body: \n` +
            `${JSON.stringify(responseBody, null, 4)}`
        )
    }
}

async function loadSchema(schemaPath: string) {
  try {
    const schemaContent = await fs.readFile(schemaPath, "utf-8");
    return JSON.parse(schemaContent);
  } catch (error) {
    throw new Error(`Failed to read schema file: ${error.message}`);
  }
}

async function generateNewSchema(responseBody: object, schemaPath: string) {
       try {
        const generatedSchema: any = createSchema(responseBody)

        // addFormats can be used for specifying extra field formatting in schemas such as date times etc
        // Ensure any `createdAt` or `updatedAt` properties include the `format: "date-time"`
        function addDateTimeFormat(node: any) {
          if (!node || typeof node !== 'object') return

          if (node.properties && typeof node.properties === 'object') {
            for (const [propName, propSchema] of Object.entries(node.properties)) {
              if (propName === 'createdAt' || propName === 'updatedAt') {
                if (propSchema && typeof propSchema === 'object') {
                  propSchema.format = 'date-time'
                }
              }
              addDateTimeFormat(propSchema)
            }
          }

          if (node.items) addDateTimeFormat(node.items)
          if (node.additionalProperties && typeof node.additionalProperties === 'object') addDateTimeFormat(node.additionalProperties)

          for (const key of ['anyOf', 'oneOf', 'allOf']) {
            if (Array.isArray(node[key])) {
              node[key].forEach((sub: any) => addDateTimeFormat(sub))
            }
          }
        }

        addDateTimeFormat(generatedSchema)

        // recursive: true means that if the folder exists, it will use the existing folder instead of creating a new one
        await fs.mkdir(path.dirname(schemaPath), {recursive: true})
        await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 4))
      } catch (error) {
        throw new Error(`Failed to create schema file: ${error.message}`)
      }
}
