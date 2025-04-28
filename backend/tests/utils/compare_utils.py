from typing import Dict, List
from scipy.stats import kstest
import numpy as np
import random

def compare_dict(dict1: Dict, dict2: Dict) -> bool:
        """
        Compare two dictionaries and return True if they are identical, otherwise False.

        :param dict1: First dictionary
        :param dict2: Second dictionary
        :return: Boolean indicating whether the dictionaries are the same
        """
        if dict1.keys() != dict2.keys():
            return False  # Different keys

        for key in dict1:
            value1, value2 = dict1[key], dict2[key]

            # Recursively compare nested dictionaries
            if isinstance(value1, dict) and isinstance(value2, dict):
                if not self.compare_dict(value1, value2):
                    return False

            # Compare lists (ensure same order and elements)
            elif isinstance(value1, list) and isinstance(value2, list):
                if len(value1) != len(value2) or any(not self.compare_dict(v1, v2) if isinstance(v1, dict) else v1 != v2 for v1, v2 in zip(value1, value2)):
                    return False

            # Direct comparison for other types
            elif value1 != value2:
                return False

        return True
    
def compare_str_list(list1:List[str], list2:List[str]):
    if len(list1) != len(list2):
        return False
    for i, elmt in enumerate(list1):
        if elmt!=list2[i]:
            return False
    return True

def assert_within_range(value, expected_min, expected_max, label="value"):
    assert expected_min <= value <= expected_max, (
        f"{label} {value} not in expected range [{expected_min}, {expected_max}]"
    )

def assert_is_uniform(valuef, lower, upper, label="value", num_samples=2000):
    random.seed(42)
    np.random.seed(42)
    # Check if value is uniformly distributed
    samples = [valuef() for _ in range(num_samples)]
    
    # Normalize to [0, 1]
    normalized_samples = [(x - lower) / (upper - lower) for x in samples]
    
    stat, p_value = kstest(normalized_samples, 'uniform')
    assert p_value > 0.05, f"KS test failed: p={p_value}, {label} not uniform"

def assert_is_normal(value_fn, expected_mean, expected_std, label="value", num_samples=2000):
    """
    value_fn: function that returns a random sample
    expected_mean: mean of the expected normal distribution
    expected_std: std dev of the expected normal distribution
    """
    random.seed(42)
    np.random.seed(42)
    
    samples = np.array([value_fn() for _ in range(num_samples)])

    # Sanity check: basic bounds (3-sigma rule)
    for i, sample in enumerate(samples):
        lower = expected_mean - 4 * expected_std
        upper = expected_mean + 4 * expected_std
        assert lower <= sample <= upper, (
            f"{label} sample {i} = {sample} is outside expected normal bounds"
        )

    # Standardize samples
    standardized_samples = (samples - expected_mean) / expected_std

    # KS test against standard normal
    stat, p_value = kstest(standardized_samples, 'norm')
    assert p_value > 0.05, (
        f"KS test failed: p={p_value:.4f}, {label} is not normally distributed"
    )
