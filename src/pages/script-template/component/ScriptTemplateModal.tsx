import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';
import { ScriptTemplate } from '@/pages/types';
import { getScriptTypes } from '../../../api'; // 假设有一个API函数用于获取话术类型

const { TextArea } = Input;

interface ScriptTemplateModalProps {
  open: boolean;
  loading: boolean;
  onOk: (values: ScriptTemplate) => void;
  onCancel: () => void;
  initialValues: ScriptTemplate | null;
}

const ScriptTemplateModal: React.FC<ScriptTemplateModalProps> = ({
  open,
  onOk,
  onCancel,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();
  const [scriptTypes, setScriptTypes] = useState<string[]>([]); // 存储话术类型的选项

  useEffect(() => {
    if (!open) {
      return;
    }
    // 请求话术类型数据
    getScriptTypes<string[]>()
      .then((response) => {
        setScriptTypes(response); // 假设API返回数据是一个数组
      })
      .catch((error) => {
        console.error('获取话术类型失败:', error);
      });

    if (open && initialValues) {
      form.setFieldsValue(initialValues); // 设置初始值
    } else {
      form.resetFields(); // 重置表单
    }
  }, [open]);

  const handleOk = async () => {
    const values = await form.validateFields();
    values.id = initialValues?.id; // 保留已有ID以便更新
    onOk(values); // 调用父组件的onOk函数
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={initialValues?.id ? '编辑话术模板' : '新增话术模板'}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="keyType"
          label="话术类型"
          rules={[{ required: true, message: '请选择话术类型' }]}
        >
          <Select placeholder="请选择话术类型">
            {scriptTypes.map((type, index) => (
              <Select.Option key={index} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="content"
          label="话术内容"
          rules={[{ required: true, message: '请输入话术内容' }]}
        >
          <TextArea
            showCount
            maxLength={1024}
            style={{ height: 120, resize: 'none' }}
            placeholder="请输入话术内容"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ScriptTemplateModal;
