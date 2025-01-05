import React, { useEffect, useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { Product } from '@/pages/types';

const { TextArea } = Input;

interface BlackListModalProps {
  open: boolean;
  loading: boolean;
  onOk: (values: Product) => void;
  onCancel: () => void;
  initialValues: Product | null;
}

const BlackListModal: React.FC<BlackListModalProps> = ({
  open,
  onOk,
  onCancel,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  // 在弹窗显示时执行一些逻辑
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues); // 设置表单的初始值
    } else {
      form.resetFields(); // 如果是新增，重置表单
    }
  }, [open, initialValues, form]);

  // 提交表单
  const handleOk = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      values.id = initialValues?.id;
      onOk(values); // 调用父组件的onOk
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Form validation failed:', error);
    }
  };

  // 处理取消逻辑
  const handleCancel = () => {
    form.resetFields(); // 重置表单
    onCancel(); // 调用父组件的onCancel
  };

  return (
    <Modal
      title={initialValues?.id ? '编辑商品' : '新增商品'}
      open={open}
      onCancel={handleCancel} // 调用自定义的取消逻辑
      onOk={handleOk}
      confirmLoading={isLoading || loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="商品名称"
          rules={[{ required: true, message: '请输入商品名称' }]}
        >
          <Input placeholder="请输入商品名称" maxLength={20} />
        </Form.Item>
        <Form.Item
          name="description"
          label="商品描述"
          rules={[{ required: false, message: '请输入商品描述' }]}
        >
          <TextArea
            showCount
            maxLength={1024}
            style={{ height: 120, resize: 'none' }}
            placeholder="请输入商品描述"
          />
        </Form.Item>
        <Form.Item
          name="targetPlatform"
          label="目标平台"
          rules={[{ required: true, message: '请输入目标平台' }]}
        >
          <Input placeholder="请输入目标平台" maxLength={100} />
        </Form.Item>
        <Form.Item
          name="orderPlatform"
          label="订单平台"
          rules={[{ required: true, message: '请输入订单平台' }]}
        >
          <Input placeholder="请输入订单平台" maxLength={100} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlackListModal;
