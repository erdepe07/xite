use pyo3::prelude::*;

/// A Python module implemented in Rust.
#[pymodule]
mod ledger_script {
    use pyo3::prelude::*;

    /// Formats the sum of two numbers as string.
    #[pyfunction]
    fn sum_as_string(a: usize, b: usize) -> PyResult<String> {
        Ok((a + b).to_string())
    }

    #[pyfunction]
    fn calculate_interest(principal: f64, rate: f64, time: f64) -> PyResult<f64> {
        Ok(principal * rate * time / 100.0)
    }

    #[pyfunction]
    fn payment_schedule(principal: f64, annual_rate: f64, years: u32) -> PyResult<Vec<f64>> {
        let monthly_rate = annual_rate / 12.0 / 100.0;
        let n_payments = years * 12;
        let monthly_payment = if monthly_rate == 0.0 {
            principal / n_payments as f64
        } else {
            let r_pow_n = (1.0 + monthly_rate).powi(n_payments as i32);
            principal * monthly_rate * r_pow_n / (r_pow_n - 1.0)
        };

        Ok(vec![monthly_payment; n_payments as usize])
    }
}