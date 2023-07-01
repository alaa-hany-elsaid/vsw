from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tests(req, site_id):
    pass


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_test(req, test_id):
    pass


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_test(req):
    pass


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def run_test(req, test_id):
    pass


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_test(req, test_id):
    pass
