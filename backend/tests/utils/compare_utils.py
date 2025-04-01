from typing import Dict, List
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