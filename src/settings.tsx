import { Button, Col, Row, Typography } from "antd";
import { useEffect } from "react";
import { proxy, subscribe, useSnapshot } from "valtio";
import { Field, FieldOption, FieldOptionString } from "./field";
import AutoFrontMatterPlugin from "./plugin";

export interface PluginSettings {
  fieldOptions: (FieldOption | FieldOptionString)[];
}
export const DEFAULT_SETTINGS: PluginSettings = {
  fieldOptions: [],
};

const settings = proxy<PluginSettings>(DEFAULT_SETTINGS);

export const Settings = (props: { plugin: AutoFrontMatterPlugin }) => {
  const { plugin } = props;

  // 初始化
  useEffect(() => {
    settings.fieldOptions = plugin.settings.fieldOptions;

    const unsubscribe = subscribe(settings, async () => {
      plugin.settings = {
        fieldOptions: settings.fieldOptions,
      };
      plugin.saveSettings();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const settingsSnapshot = useSnapshot(settings);

  return (
    <div>
      <Typography.Title level={1}>Auto Front Matter</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col span={24}></Col>
        <Col span={24}>
          <Button
            block
            onClick={() => {
              settings.fieldOptions.push({
                name: "example key name",
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
            <Col span={24} key={option.name}>
              <Field
                value={option}
                onChange={(nextOption) => {
                  settings.fieldOptions[i] = nextOption;
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
