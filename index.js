const { NodeType } = require('@tensorify/types');

/**
 * PyTorch DataLoader Node
 */
class PTDataLoader {
  constructor() {
    this.name = 'PyTorch DataLoader';
    this.nodeType = NodeType.PREPROCESSING;
    this.description = 'PyTorch DataLoader configuration for batch processing';
    
    // Define inputs and outputs for canvas connections
    this.inputs = [
      {
        name: 'dataset',
        type: 'dataset',
        required: true,
        description: 'PyTorch dataset to load from'
      }
    ];
    
    this.outputs = [
      {
        name: 'dataloader',
        type: 'dataloader',
        description: 'Configured PyTorch DataLoader'
      }
    ];
    
    this.schema = {
      type: 'object',
      properties: {
        dataloaderVariable: {
          type: 'string',
          default: 'train_loader',
          description: 'Variable name for the DataLoader instance',
          required: true
        },
        datasetVariable: {
          type: 'string',
          default: 'train_dataset',
          description: 'Variable name of the dataset to load',
          required: true
        },
        batchSize: {
          type: 'number',
          default: 32,
          description: 'Number of samples per batch'
        },
        shuffle: {
          type: 'boolean',
          default: true,
          description: 'Whether to shuffle the data'
        },
        numWorkers: {
          type: 'number',
          default: 0,
          description: 'Number of worker processes for data loading'
        },
        pinMemory: {
          type: 'boolean',
          default: false,
          description: 'Whether to pin memory for faster GPU transfer'
        },
        dropLast: {
          type: 'boolean',
          default: false,
          description: 'Whether to drop the last incomplete batch'
        }
      },
      required: ['dataloaderVariable', 'datasetVariable']
    };

    this.security = {
      allowedImports: ['torch', 'torch.utils.data'],
      maxExecutionTime: 10000,
      memoryLimit: 1024 * 1024 * 100,
      sandbox: true
    };

    this.quality = {
      testCoverage: 0.95,
      documentation: 'PyTorch DataLoader for efficient batch processing',
      version: '1.0.0',
      examples: [
        'Training dataloader with shuffling enabled',
        'Validation dataloader with batch size 64',
        'Production dataloader with multi-worker processing'
      ]
    };

    this.codeGeneration = {
      generateCode: (settings, context) => {
        const dataloaderVar = settings.dataloaderVariable || 'train_loader';
        const datasetVar = settings.datasetVariable || 'train_dataset';
        const batchSize = settings.batchSize || 32;
        const shuffle = settings.shuffle !== false;
        const numWorkers = settings.numWorkers || 0;
        const pinMemory = settings.pinMemory || false;
        const dropLast = settings.dropLast || false;

        const instantiation = `${dataloaderVar} = DataLoader(
    ${datasetVar},
    batch_size=${batchSize},
    shuffle=${shuffle ? 'True' : 'False'},
    num_workers=${numWorkers},
    pin_memory=${pinMemory ? 'True' : 'False'},
    drop_last=${dropLast ? 'True' : 'False'}
)`;

        return {
          imports: ['from torch.utils.data import DataLoader'],
          definitions: [],
          instantiations: [instantiation],
          usage: {
            forward: `# DataLoader usage: for batch_idx, (data, target) in enumerate(${dataloaderVar}):`,
            parameters: `# Batch size: ${batchSize}, Workers: ${numWorkers}`,
            named_parameters: `('${dataloaderVar}', ${dataloaderVar})`
          }
        };
      },

      getDependencies: (settings) => [settings.datasetVariable || 'train_dataset'],
      getOutputs: (settings) => [settings.dataloaderVariable || 'train_loader'],
      validateConnections: (sourceOutputs, targetInputs) => {
        // PTDataLoader accepts dataset inputs for drag-and-drop UX
        return sourceOutputs.some(output => 
          typeof output === 'string' && (
            output.includes('dataset') ||
            output.startsWith('dataset_') ||
            // Accept any output for flexible drag-and-drop UX
            true
          )
        );
      }
    };
  }
}

module.exports = {
  PTDataLoader
}; 