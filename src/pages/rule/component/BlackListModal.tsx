import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { BlackListRule } from '../../../pages/types';
import { getFieldList } from '../../../api/modules/crawler';
const { TextArea } = Input;
interface BlackListModalProps {
  open: boolean;
  loading: boolean;
  onOk: (values: BlackListRule) => void;
  onCancel: () => void;
  initialValues: BlackListRule | null;
}
interface FieldOption {
  field: string;
  comment: string;
}

const BlackListModal: React.FC<BlackListModalProps> = ({
  open,
  onOk,
  onCancel,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();
  // const [isLoading, setIsLoading] = useState(false);
  const [fieldOptions, setFieldOptions] = useState<FieldOption[]>([]);
  const [fieldLoading, setFieldLoading] = useState(false);
  // 在弹窗显示时执行一些逻辑
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues); // 设置表单的初始值
    } else {
      form.resetFields(); // 如果是新增，重置表单
    }
    if (open) {
      fieldList();
    }
  }, [open, initialValues, form]);
  const fieldList = () => {
    setFieldLoading(true);
    getFieldList<FieldOption[]>()
      .then((res) => {
        setFieldOptions(res);
      })
      .finally(() => {
        setFieldLoading(false);
      });
  };

  // 提交表单
  const handleOk = async () => {
    const values = await form.validateFields();
    values.id = initialValues?.id;
    onOk(values); // 调用父组件的onOk
  };

  // 处理取消逻辑
  const handleCancel = () => {
    form.resetFields(); // 重置表单
    onCancel(); // 调用父组件的onCancel
  };

  return (
    <Modal
      title={initialValues?.id ? '编辑规则' : '新增规则'}
      open={open}
      onCancel={handleCancel} // 调用自定义的取消逻辑
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="fieldName"
          label="匹配字段"
          rules={[{ required: true, message: '请选择匹配字段' }]}
        >
          <Select
            disabled={initialValues?.id ? true : false}
            placeholder="请选择匹配字段"
            loading={fieldLoading}
            filterOption={false}
          >
            {fieldOptions.map((item) => (
              <Select.Option key={item.field} value={item.field}>
                {item.field}&nbsp;
                <span className="text-red-600">{item.comment}</span>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="alias"
          label="别名"
          rules={[{ required: true, message: '请输入别名' }]}
        >
          <Input placeholder="请输入别名" />
        </Form.Item>
        <Form.Item
          name="regexPattern"
          label="正则表达式"
          rules={[{ required: true, message: '请输入正则表达式' }]}
        >
          <TextArea
            showCount
            maxLength={1024}
            style={{ height: 120, resize: 'none' }}
            placeholder="请输入正则表达式"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlackListModal;
