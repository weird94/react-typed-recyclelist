import { Component } from 'react';
import { CellProps } from './index';

class StoreComponent<T> extends Component<CellProps<T>> {
  _preKey = '';

  tryToRestoreState() {
    const { index, uniqueKey, store } = this.props;
    const nextKey = uniqueKey || index + '';

    if (this._preKey !== nextKey) {
      this.props._setStore(this.state, this._preKey);
      this.setState(store);
      this._preKey = nextKey;
    }
  }

  componentDidUpdate() {
    this.tryToRestoreState();
  }

  componentDidMount() {
    this.tryToRestoreState();
  }
}

export default StoreComponent;
