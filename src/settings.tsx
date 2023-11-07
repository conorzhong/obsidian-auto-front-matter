import { Button, Col, Row, Typography } from "antd";
import { useSnapshot } from "valtio";
import { DEFAULT_FIELD_NAME, Field, FieldOption } from "./field";
import AutoFrontMatterPlugin from "./plugin";

export interface PluginSettings {
  fieldOptions: FieldOption[];
}
export const DEFAULT_SETTINGS: PluginSettings = {
  fieldOptions: [],
};

export const Settings = (props: { plugin: AutoFrontMatterPlugin }) => {
  const { plugin } = props;

  const settings = plugin.settings;
  const settingsSnapshot = useSnapshot(settings);

  return (
    <div>
      <Typography.Title level={1}>Auto Front Matter</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Button
            block
            onClick={() => {
              settings.fieldOptions.push({
                name: DEFAULT_FIELD_NAME,
                valueType: "string",
                actionType: "none",
                valueOption: {
                  content: "",
                },
              });
            }}
          >
            Add a field
          </Button>
        </Col>
        {settingsSnapshot.fieldOptions.map((option, i) => {
          return (
            <Col span={24} key={i}>
              <Field
                value={option}
                onChange={(nextOption) => {
                  settings.fieldOptions[i] = { ...nextOption };
                }}
                onDelete={() => {
                  settings.fieldOptions.splice(i, 1);
                }}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
