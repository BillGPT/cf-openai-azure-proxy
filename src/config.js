// 配置文件: 保存资源名称、模型部署映射及 API 版本

// Azure OpenAI Service 的资源名称
export const resourceName = RESOURCE_NAME;

// 模型名稱到部署名稱的映射表
export const mapper = {
    'gpt-3.5-turbo': DEPLOY_NAME_GPT35,
    'gpt-3.5-turbo-0613': DEPLOY_NAME_GPT35,
    'gpt-3.5-turbo-1106': DEPLOY_NAME_GPT35,
    'gpt-3.5-turbo-16k': DEPLOY_NAME_GPT35,
    'gpt-4': DEPLOY_NAME_GPT4,
    'gpt-4-0613': DEPLOY_NAME_GPT4,
    'gpt-4-1106-preview': DEPLOY_NAME_GPT4,
    'gpt-4-32k': DEPLOY_NAME_GPT4,
    'dall-e-3': typeof DEPLOY_NAME_DALLE3 !== 'undefined' ? DEPLOY_NAME_DALLE3 : 'dalle3',
};

// Azure 接口版本
export const apiVersion = '2023-12-01-preview';
