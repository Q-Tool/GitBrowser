import {view} from '@risingstack/react-easy-state';

export default view((props) => (
    <i className={`language-icon devicon-${props.icon}`} />
))