import { Tag, Input, Tooltip, Icon } from 'antd';
import React, {Component} from 'react';
class EditableTagGroup extends Component {
    constructor(props){
      super(props);
      this.state = {
          tags: [],
          inputVisible: false,
          inputValue: '',
      };

      this.handleClose = (removedTag) => {
          const tags = this.state.tags.filter(tag => tag !== removedTag);
          this.setState({ tags },this.props.onChange(tags));
      }
      this.showInput = () => {
          this.setState({ inputVisible: true }, () => this.input.focus());
      }
      this.handleInputChange = (e) => {
          this.setState({ inputValue: e.target.value });
      }
      this.handleInputConfirm = () => {
          const state = this.state;
          const inputValue = state.inputValue;
          let tags = state.tags;
          if (inputValue && tags.indexOf(inputValue) === -1) {
              tags = [...tags, inputValue];
          }
          this.setState({
              tags,
              inputVisible: false,
              inputValue: '',
          },this.props.onChange&&this.props.onChange(tags));
      }
      this.saveInputRef = input => this.input = input
  }
    componentWillReceiveProps(nextProps) {
        if(nextProps.value&&nextProps.value!==this.state.tags){
            this.setState({tags:nextProps.value});
        }
    }
    render() {
        const { tags, inputVisible, inputValue } = this.state;
        return (
            <div>
                {tags.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag key={tag} closable={index !== -1} afterClose={() => this.handleClose(tag)}>
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </Tag>
                    );
                    return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {inputVisible && (
                    <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!inputVisible && (
                    <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                    >
                        <Icon type="plus" /> 添加新IP
                    </Tag>
                )}
            </div>
        );
    }
}
export default EditableTagGroup;
