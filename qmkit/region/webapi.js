import QMConfig from '../config';
import QMFetch from '../fetch';


/**
 * 一次性获取所有的省市区数据
 */
const fetchAll = () => {
	return QMFetch(`${QMConfig.HOST}/area/all`);
};


export {fetchAll};
export default {fetchAll};