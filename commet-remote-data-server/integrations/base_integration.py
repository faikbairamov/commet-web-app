"""
Base integration class for all third-party service integrations
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Any
import requests
import json
import logging

logger = logging.getLogger(__name__)

class BaseIntegration(ABC):
    """Base class for all integrations"""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize integration with configuration
        
        Args:
            config: Dictionary containing integration configuration
        """
        self.config = config
        self.base_url = config.get('base_url')
        # Support both 'api_key' and 'api_token' for different integrations
        self.api_key = config.get('api_key') or config.get('api_token')
        self.headers = self._get_headers()
        self.enabled = config.get('enabled', True)
        
        if not self.base_url:
            raise ValueError("base_url is required in integration config")
        if not self.api_key:
            raise ValueError("api_key or api_token is required in integration config")
    
    @abstractmethod
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for API requests"""
        pass
    
    @abstractmethod
    def test_connection(self) -> bool:
        """Test if integration is working"""
        pass
    
    @abstractmethod
    def send_data(self, data: Dict[str, Any]) -> bool:
        """Send data to the integration"""
        pass
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                     params: Optional[Dict] = None) -> Optional[requests.Response]:
        """
        Make HTTP request to integration API
        
        Args:
            method: HTTP method (GET, POST, PUT, DELETE)
            endpoint: API endpoint
            data: Request body data
            params: Query parameters
            
        Returns:
            Response object or None if request failed
        """
        if not self.enabled:
            logger.warning(f"Integration {self.__class__.__name__} is disabled")
            return None
            
        url = f"{self.base_url.rstrip('/')}/{endpoint.lstrip('/')}"
        
        try:
            response = requests.request(
                method=method,
                url=url,
                headers=self.headers,
                json=data,
                params=params,
                timeout=30
            )
            
            if response.status_code >= 400:
                logger.error(f"API request failed: {response.status_code} - {response.text}")
                return None
                
            return response
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed: {str(e)}")
            return None
    
    def get_status(self) -> Dict[str, Any]:
        """
        Get integration status
        
        Returns:
            Dictionary containing status information
        """
        return {
            'name': self.__class__.__name__,
            'enabled': self.enabled,
            'connected': self.test_connection() if self.enabled else False,
            'base_url': self.base_url
        }
