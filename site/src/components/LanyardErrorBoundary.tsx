"use client";

import { Component, type ReactNode } from "react";
import LanyardFallback from "./LanyardFallback";

interface Props {
  children: ReactNode;
  frontImage: string;
  backImage: string;
  fallback?: ReactNode;
  onError?: () => void;
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

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) return this.props.fallback;
      return <LanyardFallback frontImage={this.props.frontImage} />;
    }
    return this.props.children;
  }
}
