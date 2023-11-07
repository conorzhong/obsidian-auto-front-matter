import { Button, Card, Col, Form, Input, Row, Select } from "antd";
import keyBy from "lodash-es/keyBy";
import moment from "moment";
import { customAlphabet } from "nanoid";
import { TFile } from "obsidian";
const nanoid = customAlphabet("1234567890abcdef", 10);

type ValueType =
  | "string"
  | "datetime"
  | "id"
  | "title"
  | "datetimeCreate"
  | "datetimeUpdate";

type ActionType = "delete" | "update" | "append" | "once" | "none";

export interface FieldOptionBase {
  name: string;
  valueType: ValueType;
  actionType: ActionType;
}

export interface FieldOptionString extends FieldOptionBase {
  valueType: "string";
  valueOption: {
    content: string;
  };
}

export type FieldOption = FieldOptionBase | FieldOptionString;

export const computeField = (fieldOption: FieldOption, file: TFile) => {
  if (fieldOption.valueType === "string") {
    return (fieldOption as FieldOptionString).valueOption.content;
  } else if (fieldOption.valueType === "datetime") {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  } else if (fieldOption.valueType === "id") {
    return nanoid();
  } else if (fieldOption.valueType === "title") {
    return file.basename;
  } else if (fieldOption.valueType === "datetimeCreate") {
    return moment(file.stat.ctime).format("YYYY-MM-DD HH:mm:ss");
  } else if (fieldOption.valueType === "datetimeUpdate") {
    return moment(file.stat.mtime).format("YYYY-MM-DD HH:mm:ss");
  }
};

export const modifyFrontMatter = (
  frontMatter: any,
  fieldOptions: FieldOption[],
  file: TFile
) => {
  const hash = keyBy(fieldOptions, "name");
  for (const key in hash) {
    if (Object.prototype.hasOwnProperty.call(hash, key)) {
      const fieldOption = hash[key];
      const actionType = fieldOption.actionType;
      if (actionType === "none") {
        continue;
      } else if (actionType === "delete") {
        delete frontMatter[fieldOption.name];
      } else if (actionType === "update") {
        const nextValue = computeField(fieldOption, file);
        frontMatter[fieldOption.name] = nextValue;
      } else if (actionType === "append") {
        const nextValue = computeField(fieldOption, file);
        const value = frontMatter[fieldOption.name];
        if (!value) {
          // empty
          frontMatter[fieldOption.name] = [nextValue];
        } else if (!Array.isArray(value)) {
          // single, not array
          if (value !== nextValue) {
            frontMatter[fieldOption.name] = [value, nextValue];
          }
        } else {
          // array
          if (!value.includes(nextValue)) {
            value.push(nextValue);
          }
        }
      } else if (actionType === "once") {
        const nextValue = computeField(fieldOption, file);
        const value = frontMatter[fieldOption.name];
        if (!value) {
          // empty
          frontMatter[fieldOption.name] = nextValue;
        }
      }
    }
  }
};

export const DEFAULT_FIELD_NAME = "exampleKeyName";

interface FieldProps {
  value: FieldOption;
  onChange: (option: FieldOption) => void;
  onDelete: () => void;
}

export const Field = (props: FieldProps) => {
  const { value, onChange, onDelete } = props;

  const [form] = Form.useForm();
  const name = Form.useWatch("name", form);

  return (
    <Form
      initialValues={value}
      onValuesChange={(changed, values) => {
        onChange(values);
      }}
      form={form}
    >
      <Card
        title={name}
        extra={
          <Button
            danger
            onClick={() => {
              onDelete();
            }}
          >
            Delete
          </Button>
        }
      >
        <Row gutter={16}>
          <Col>
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="Action Type" name="actionType">
              <Select
                popupMatchSelectWidth={false}
                options={[
                  { label: "None", value: "none" },
                  { label: "Append", value: "append" },
                  { label: "Update", value: "update" },
                  { label: "Delete", value: "delete" },
                  { label: "Once", value: "once" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="Value Type" name="valueType">
              <Select
                popupMatchSelectWidth={false}
                options={[
                  { label: "string", value: "string" },
                  { label: "datetime", value: "datetime" },
                  { label: "id", value: "id" },
                  { label: "title", value: "title" },
                  { label: "datetimeCreate", value: "datetimeCreate" },
                  { label: "datetimeUpdate", value: "datetimeUpdate" },
                ]}
              />
            </Form.Item>
          </Col>
          {value.valueType === "string" && (
            <Col>
              <Form.Item label="Content" name={["valueOption", "content"]}>
                <Input />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Card>
    </Form>
  );
};
