import React, {useEffect, useRef, useState} from 'react';
import {Button, Form, Input, Select, PageHeader, Steps, message, notification} from "antd";
import style from "./News.module.css"
import axios from "axios";
import NewsEditor from "../../../components/news-manage/NewsEditor";
import {useNavigate, useParams} from "react-router-dom";

const {Option} = Select;

export default function NewsUpdate(props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [categories, setCategories] = useState([]);
    const [newsFormInfo, setNewsFormInfo] = useState({});
    const [newsContent, setNewsContent] = useState("");
    const navigate = useNavigate();

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1)
    };
    const handleNext = () => {
        if (currentStep === 0) {
            NewsForm.current.validateFields().then(value => {
                setCurrentStep(currentStep + 1)
                setNewsFormInfo(value);
            }).catch(error => {
                console.log(error);
            })
        } else {
            if (newsContent === "" || newsContent === undefined || newsContent.trim() === "<p></p>") {
                message.error("新聞內容不得為空");
            } else {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const NewsForm = useRef();
    const {id} = useParams();

    useEffect(() => {
        axios.get(`/news/${id}?_expand=category`).then(res => {
            let {title, categoryId, content} = res.data;
            NewsForm.current.setFieldsValue({
                title,
                categoryId
            });
            setNewsContent(content)
        })
    }, []);

    useEffect(() => {
        axios.get("/categories").then(res => {
            setCategories(res.data)
        })
    }, [])

    const handleSave = (auditState) => {
        axios.patch(`/news/${id}`, {
            ...newsFormInfo,
            "content": newsContent,
            "auditState": auditState,
        }).then(res => {
            let route = auditState === 0 ? "/news-manage/draft" : "/audit-manage/list";
            navigate(route)
            notification.info({
                message: `通知`,
                description: `可以在${auditState === 0 ? "草稿箱" : "審核列表"}中查看你的新聞`,
                placement: "bottomRight",
            });
        })
    };

    const items = [{
        title: "基本訊息",
        description: "新聞標題, 新聞分類"
    }, {
        title: "新聞內容",
        description: "新聞主體內容"
    }, {
        title: "新聞提交",
        description: "保存草稿或提交審核"
    }]

    return (
        <div>
            <PageHeader
                onBack={() => window.history.back()}
                className="site-page-header"
                title="修改新聞"
                subTitle="This is a subtitle"
            />
            <Steps items={items} current={currentStep}/>

            <div style={{marginTop: "50px"}}>
                <div className={currentStep === 0 ? '' : style.active}>
                    <Form
                        ref={NewsForm}
                        name="basic"
                        labelCol={{
                            span: 2,
                        }}
                        wrapperCol={{
                            span: 22,
                        }}
                    >
                        <Form.Item
                            label="新聞標題:"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="新聞分類"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Select>
                                {
                                    categories.map(category => {
                                        return <Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={currentStep === 1 ? '' : style.active}>
                    <NewsEditor getContent={(value) => {
                        setNewsContent(value);
                    }} newsContent={newsContent}></NewsEditor>
                </div>
                <div className={currentStep === 2 ? '' : style.active}>
                </div>
            </div>

            <div style={{marginTop: "50px"}}>
                {
                    currentStep === 2 &&
                    <span>
                    <Button type="primary" onClick={() => handleSave(0)}>保存到草稿箱</Button>
                    <Button danger onClick={() => handleSave(1)}>提交審核</Button>
                </span>
                }
                {
                    currentStep > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }
                {
                    currentStep < 2 && <Button type="primary" onClick={handleNext}> 下一步 </Button>
                }
            </div>
        </div>
    );
}
