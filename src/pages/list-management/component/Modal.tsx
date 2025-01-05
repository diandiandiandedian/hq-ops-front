import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { ListManagement } from '@/pages/types';
const { TextArea } = Input;

interface BlackListModalProps {
  open: boolean;
  loading: boolean;
  onOk: (values: ListManagement) => void;
  onCancel: () => void;
  initialValues: ListManagement | null;
}

const BlackListModal: React.FC<BlackListModalProps> = ({
  open,
  onOk,
  onCancel,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues); // Set initial values if available
    } else {
      form.resetFields(); // Reset fields if it's a new entry
    }
  }, [open, initialValues, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    values.id = initialValues?.id; // Retain existing id for update
    onOk(values); // Call parent onOk function
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={initialValues?.id ? '编辑规则' : '新增规则'}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="platform"
          label="用户平台"
          rules={[{ required: true, message: '请选择用户平台' }]}
        >
          <Input placeholder="请输入用户平台" />
        </Form.Item>
        <Form.Item
          name="uuid"
          label="用户唯一标识"
          rules={[{ required: true, message: '请输入用户唯一标识' }]}
        >
          <Input placeholder="请输入用户唯一标识" />
        </Form.Item>
        <Form.Item
          name="nickname"
          label="用户昵称"
          rules={[{ required: true, message: '请输入用户昵称' }]}
        >
          <Input placeholder="请输入用户昵称" />
        </Form.Item>
        <Form.Item
          name="reason"
          label="原因"
          rules={[{ required: true, message: '请输入原因' }]}
        >
          <TextArea
            showCount
            maxLength={1024}
            style={{ height: 120, resize: 'none' }}
            placeholder="请输入原因"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlackListModal;
