import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Radio } from 'antd';
import { KeywordsManagement } from '../../../pages/types'; // 假设 KeywordsManagement 类型在该路径下
import {
  queryProductByKeywords,
  queryProduct,
} from '../../../api/modules/crawler';

interface BlackListModalProps {
  open: boolean;
  loading: boolean;
  onOk: (values: KeywordsManagement) => void;
  onCancel: () => void;
  initialValues: KeywordsManagement | null;
}
interface Product {
  id?: number;
  name?: string;
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
  const [productList, setProductList] = useState<Product[]>([]);
  const [productSearchLoading, setProductSearchLoading] = useState(false);
  const [isSmartBlacklisted, setIsSmartBlacklisted] = useState(0);
  const [isSmartWhitelisted, setIsSmartWhitelisted] = useState(0);

  // 初始化表单和状态
  useEffect(() => {
    if (open) {
      if (initialValues) {
        console.log('initialValues', initialValues);
        form.setFieldsValue(initialValues);
        if (initialValues.productId) {
          queryProductName(initialValues.productId);
        }

        setIsSmartBlacklisted(initialValues.smartBlacklisted ? 1 : 0);
        setIsSmartWhitelisted(initialValues.smartWhitelisted ? 1 : 0);
        if (initialValues.smartBlacklisted) {
          form.setFieldsValue({ smartBlacklistedRadio: 1 });
        } else {
          form.setFieldsValue({
            smartBlacklistedRadio: initialValues.smartBlacklisted,
          });
        }
        if (initialValues.smartWhitelisted) {
          form.setFieldsValue({ smartWhitelistedRadio: 1 });
        } else {
          form.setFieldsValue({
            smartWhitelistedRadio: initialValues.smartWhitelisted,
          });
        }
      } else {
        form.resetFields();
        setIsSmartBlacklisted(0);
        setIsSmartWhitelisted(0);
      }
    }
  }, [open, initialValues, form]);

  const queryProductName = (productId: number) => {
    setProductSearchLoading(true);
    queryProduct<Product>({ id: productId })
      .then((res) => {
        setProductList([{ id: productId, name: res.name }]);
      })
      .finally(() => {
        setProductSearchLoading(false);
      });
  };
  // 提交表单
  const handleOk = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      values.id = initialValues?.id;
      values.smartBlacklisted = values.smartBlacklisted || 0;
      values.smartWhitelisted = values.smartWhitelisted || 0;
      onOk(values);
    } catch (error) {
      console.error('Form validation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 商品搜索
  const handleProductSearch = async (value: string) => {
    if (!value) {
      setProductList([]);
      return;
    }
    setProductSearchLoading(true);
    try {
      const res = await queryProductByKeywords<Product[]>({ keywords: value });
      setProductList(res);
    } finally {
      setProductSearchLoading(false);
    }
  };

  // 状态更新工具函数
  const updateSmartState = (type: 'blacklist' | 'whitelist', value: number) => {
    if (type === 'blacklist') {
      setIsSmartBlacklisted(value);
      form.setFieldsValue({
        smartBlacklisted: value === 1 ? null : 0,
      });
    } else if (type === 'whitelist') {
      setIsSmartWhitelisted(value);
      form.setFieldsValue({
        smartWhitelisted: value === 1 ? null : 0,
      });
    }
  };

  return (
    <Modal
      title={initialValues?.id ? '编辑关键字' : '新增关键字'}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={isLoading || loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="keyword"
          label="关键词"
          rules={[{ required: true, message: '请输入关键词' }]}
        >
          <Input placeholder="请输入关键词" />
        </Form.Item>

        <Form.Item
          name="productId"
          label="所属商品"
          rules={[{ required: true, message: '请选择商品' }]}
        >
          <Select
            showSearch
            placeholder="请选择所属商品"
            loading={productSearchLoading}
            onSearch={handleProductSearch}
            filterOption={false}
            notFoundContent={productSearchLoading ? '搜索中...' : '未找到商品'}
          >
            {productList.map((product) => (
              <Select.Option key={product.id} value={product.id}>
                {product.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="priority"
          label="优先级"
          rules={[{ required: true, message: '请输入优先级' }]}
        >
          <Input type="number" placeholder="请输入优先级" />
        </Form.Item>

        <Form.Item
          name="autoExpand"
          label="是否自动拓展"
          rules={[{ required: true, message: '请选择是否自动拓展' }]}
        >
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="smartBlacklistedRadio"
          label="智能拉黑"
          rules={[{ required: true, message: '请选择是否启用智能拉黑' }]}
        >
          <Radio.Group
            onChange={(e) => updateSmartState('blacklist', e.target.value)}
            value={isSmartBlacklisted}
          >
            <Radio value={1}>启用</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        </Form.Item>

        {isSmartBlacklisted === 1 && (
          <Form.Item
            name="smartBlacklisted"
            label="智能拉黑等级"
            rules={[{ required: true, message: '请输入等级' }]}
          >
            <Input type="number" placeholder="请输入智能拉黑等级" />
          </Form.Item>
        )}

        <Form.Item
          name="smartWhitelistedRadio"
          label="智能加白"
          rules={[{ required: true, message: '请选择是否启用智能加白' }]}
        >
          <Radio.Group
            onChange={(e) => updateSmartState('whitelist', e.target.value)}
            value={isSmartWhitelisted}
          >
            <Radio value={1}>启用</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        </Form.Item>

        {isSmartWhitelisted === 1 && (
          <Form.Item
            name="smartWhitelisted"
            label="智能加白等级"
            rules={[{ required: true, message: '请输入等级' }]}
          >
            <Input type="number" placeholder="请输入智能加白等级" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default BlackListModal;
