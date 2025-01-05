import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import {
  queryRuleList,
  filterNotesComment,
  getFieldList,
} from '../../../api/modules/crawler';

interface FieldOption {
  field: string;
  comment: string;
}
interface BlackListModalProps {
  open: boolean;
  loading: boolean;
  onOk: () => void;
  onCancel: () => void;
  initialValues: { filterType?: number };
}
interface Rule {
  id?: number;
  alias?: string;
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
  const [productSearchLoading, setProductSearchLoading] = useState(false);

  const [ruleList, setRuleList] = useState<Rule[]>([]);

  const [fieldOptions, setFieldOptions] = useState<FieldOption[]>([]);
  const [fieldLoading, setFieldLoading] = useState(false);
  const queryRuleList_ = () => {
    setProductSearchLoading(true);
    queryRuleList<Rule[]>({ type: initialValues?.filterType })
      .then((res) => {
        setRuleList(res);
      })
      .finally(() => {
        setProductSearchLoading(false);
      });
  };

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

  // 初始化表单和状态
  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.resetFields();
        // console.log('initialValues', initialValues);
        queryRuleList_();
        fieldList();
        // form.setFieldsValue(initialValues);
        // if (initialValues.productId) {
        //   queryProductName(initialValues.productId);
        // }

        // setIsSmartBlacklisted(initialValues.smartBlacklisted ? 1 : 0);
        // setIsSmartWhitelisted(initialValues.smartWhitelisted ? 1 : 0);
        // if (initialValues.smartBlacklisted) {
        //   form.setFieldsValue({ smartBlacklistedRadio: 1 });
        // } else {
        //   form.setFieldsValue({
        //     smartBlacklistedRadio: initialValues.smartBlacklisted,
        //   });
        // }
        // if (initialValues.smartWhitelisted) {
        //   form.setFieldsValue({ smartWhitelistedRadio: 1 });
        // } else {
        //   form.setFieldsValue({
        //     smartWhitelistedRadio: initialValues.smartWhitelisted,
        //   });
        // }
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  // 提交表单
  const handleOk = async () => {
    form.validateFields().then((res) => {
      console.log('res', res);
      setIsLoading(true);
      filterNotesComment({
        ruleId: res.ruleId,
        reason: res.reason,
        field: res.field,
      })
        .then((_) => {
          onOk();
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
    // try {
    //   setIsLoading(true);
    //   const values = await form.validateFields();
    //   // values.id = initialValues?.id;
    //   // values.smartBlacklisted = values.smartBlacklisted || 0;
    //   // values.smartWhitelisted = values.smartWhitelisted || 0;
    //   // onOk(values);
    // } catch (error) {
    //   console.error('Form validation failed:', error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <Modal
      title={initialValues?.filterType === 0 ? '匹配黑名单' : '匹配白名单'}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText={'开始匹配'}
      confirmLoading={isLoading || loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="field"
          label="匹配字段"
          rules={[{ required: true, message: '请选择匹配字段' }]}
        >
          <Select
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
          name="ruleId"
          label="规则"
          rules={[{ required: true, message: '请选择规则' }]}
        >
          <Select
            showSearch
            placeholder="请选择规则"
            loading={productSearchLoading}
            filterOption={false}
          >
            {ruleList.map((product) => (
              <Select.Option key={product.id} value={product.id}>
                {product.alias}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="reason"
          label="匹配原因"
          rules={[{ required: false, message: '请输入匹配原因' }]}
        >
          <Input placeholder="请输入匹配原因" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlackListModal;
