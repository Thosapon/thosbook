import React from 'react';

/**
 * Custom Error Boundary
 * ดักจับ Unexpected React Runtime Errors ไม่ให้แอปพลิเคชัน Crash หน้าขาว
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Error Boundary Caught:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-6 text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900">เกิดข้อผิดพลาดไม่คาดคิด</h2>
              <p className="mt-2 text-sm text-gray-500">
                ระบบพบปัญหาบางอย่างในการแสดงผล กรุณาลองรีโหลดหน้าเว็บใหม่อีกครั้ง
              </p>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <pre className="text-left text-xs bg-gray-100 p-3 rounded text-red-800 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </pre>
            )}

            <button
              onClick={this.handleReload}
              className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              รีโหลดหน้าเว็บ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}