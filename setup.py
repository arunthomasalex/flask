from setuptools import setup, find_packages

setup(
    name = 'run',
    version = 1.0,
    packages= find_packages(exclude='testcasesui'),
    py_modules= ['run'],
    include_package_data=True,
    install_requires=[
        'Click',
    ],
    entry_points='''
    [console_scripts]
    run=run:run_command
    '''
)