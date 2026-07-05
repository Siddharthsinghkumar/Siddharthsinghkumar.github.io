"use client";

import { Component, type ReactNode } from "react";
import LanyardFallback from "./LanyardFallback";

interface Props {
  children: ReactNode;
  frontImage: string;
  backImage: string;
}

interface State {
  hasError: boolean;
}

export default class LanyardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <LanyardFallback frontImage={this.props.frontImage} />;
    }
    return this.props.children;
  }
}
